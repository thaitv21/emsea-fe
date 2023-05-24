import React, {useCallback, useEffect, useRef, useState} from 'react';
import './App.css';

async function getPreSignedUrl(filename: string) {
  const res = await fetch('https://7fgzo5rl58.execute-api.ap-southeast-1.amazonaws.com/main', {
    method: 'POST',
    body: JSON.stringify({file: filename})
  });
  const data = await res.json();
  return data['url'];
}

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.set('file', file);

  const url = await getPreSignedUrl(file.name);

  await fetch(url, {
    method: 'PUT',
    body: formData
  });
}

async function getFiles() {
  const res = await fetch('https://7fgzo5rl58.execute-api.ap-southeast-1.amazonaws.com/main');
  return await res.json();
}

function App() {
  const [files, setFiles] = useState<string[]>();
  const [selectedFile, setSelectedFile] = useState<string>();
  const ref = useRef<HTMLInputElement>(null);
  const onSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    console.log(ref.current?.files);
    if (!ref.current || !ref.current.files || ref.current.files.length === 0) return;
    const file = ref.current.files.item(0);
    if (!file) return;
    uploadFile(file).then(() => alert('Done'));
  }, [ref]);

  useEffect(() => {
    getFiles().then((data) => setFiles(data));
  }, []);

  const view = useCallback(() => {

  }, [selectedFile]);

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input ref={ref} type="file" placeholder="file" />
        <button type="submit">Upload</button>
      </form>
      <section>
        <select onChange={event => setSelectedFile(event.target.value)}>
          {files?.map((file) => (
            <option key={file}>{file}</option>
          ))}
        </select>
        <button>View</button>
      </section>
    </div>
  );
}

export default App;
