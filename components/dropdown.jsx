import React, { useEffect, useState } from 'react';

const DropdownMenu = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

  // Fetch files dynamically
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/files/file-list.json'); // List of files in JSON format
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleSelect = (event) => {
    setSelectedFile(event.target.value);
    console.log('Selected file:', event.target.value);
  };

  return (
    <div>
      <select onChange={handleSelect} value={selectedFile}>
        <option value="">Select a file</option>
        {files.map((file, index) => (
          <option key={index} value={file}>
            {file}
          </option>
        ))}
      </select>

      {selectedFile && (
        <p>
          You selected: <a href={`/files/${selectedFile}`} target="_blank" rel="noopener noreferrer">{selectedFile}</a>
        </p>
      )}
    </div>
  );
};

export default DropdownMenu;
