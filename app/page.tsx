"use client"
import { useState } from 'react';
import { useGenerateschedule } from './hooks/useGenerateSchedule';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { schedule, fetchSchedule, setSchedule } = useGenerateschedule();

  const handlePromptChange = (event: any) => {
    setPrompt(event.target.value);
  };
  const updateSchedule = async () => {
    setLoading(true);
    await fetchSchedule(prompt);
    setLoading(false);
  };
  return (
    <div className="container">
      <h1>未来日記</h1>
      <div className="form-container">
        <input
          type="text"
          className="form-input"
          id="prompt"
          placeholder="あなたのなりたい姿を具体的に書いてね"
          value={prompt}
          onChange={handlePromptChange}
          required
        />
        <button className="form-button" onClick={updateSchedule}>
          生成
        </button>
      </div>
    </div>
  )
}