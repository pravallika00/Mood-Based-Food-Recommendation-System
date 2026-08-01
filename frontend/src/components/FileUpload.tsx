import React, { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  label,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex flex-col items-center space-y-2">
          <FiUpload className="w-8 h-8 text-gray-400" />
          <span className="text-gray-600 font-medium">{label}</span>
          <span className="text-sm text-gray-400">
            Click to browse files
          </span>
        </div>
      </button>
    </div>
  );
};

export default FileUpload;