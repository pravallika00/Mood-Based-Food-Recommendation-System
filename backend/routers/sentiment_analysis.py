from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import torch
import torch.nn as nn
from transformers import BertTokenizer, BertModel, BertConfig
import re
import os

router = APIRouter()

# BERT Classifier Class
class BertClassifier(nn.Module):
    def __init__(self, n_classes, pretrained_model_path):
        super(BertClassifier, self).__init__()
        config = BertConfig.from_pretrained(pretrained_model_path)
        self.bert = BertModel(config)
        self.drop = nn.Dropout(p=0.3)
        self.out = nn.Linear(self.bert.config.hidden_size, n_classes)

    def forward(self, input_ids, attention_mask):
        _, pooled_output = self.bert(
            input_ids=input_ids, 
            attention_mask=attention_mask, 
            return_dict=False
        )
        return self.out(self.drop(pooled_output))

# Load model
try:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = BertTokenizer.from_pretrained('models/sentiment_model/token')
    model = BertClassifier(2, 'models/sentiment_model/token')
    
    state_dict = torch.load('models/sentiment_model/sentiment_model.h5', map_location=device)
    
    current_vocab_size = model.bert.embeddings.word_embeddings.weight.shape[0]
    saved_vocab_size = state_dict.get('bert.embeddings.word_embeddings.weight').shape[0]
    
    if current_vocab_size != saved_vocab_size:
        model.bert.resize_token_embeddings(len(tokenizer))
    
    model.load_state_dict(state_dict, strict=False)
    model.to(device)
    model.eval()
    print("Sentiment model loaded successfully!")
except Exception as e:
    print(f"Warning: sentiment_model.h5 not found. {e}")
    model = None
    tokenizer = None

sentiment_labels = ['negative', 'positive']

def clean_text(text):
    """Clean input text"""
    text = re.sub(r"@\S+|https?://\S+|[^A-Za-z0-9\s]+", ' ', str(text).lower())
    return text.strip()

# Request model
class TextInput(BaseModel):
    text: str

@router.post("/")
def predict_sentiment(input_data: TextInput):
    if model is None:
        return {"error": "Sentiment model not loaded"}
    
    try:
        text = input_data.text.strip()
        if not text:
            return {"error": "Text cannot be empty"}
        
        cleaned_text = clean_text(text)
        
        encoding = tokenizer.encode_plus(
            cleaned_text,
            add_special_tokens=True,
            max_length=128,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )
        
        input_ids = encoding['input_ids'].to(device)
        attention_mask = encoding['attention_mask'].to(device)
        
        with torch.no_grad():
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_class_idx = torch.max(probabilities, dim=1)
            sentiment = sentiment_labels[predicted_class_idx.item()]
        
        return {
            "sentiment": sentiment,
            "confidence": float(confidence.item())
        }
        
    except Exception as e:
        return {"error": f"Processing failed: {str(e)}"}
