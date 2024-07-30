import { useState, useEffect } from 'react';
import '../src/app/globals.css';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api-liturgia.edicoescnbb.com.br/contents/in/date');
        const result = await response.json();
        setData(result.content || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (

    <section className="container">
      <div className="container" dangerouslySetInnerHTML={{ __html: data.details }} />
      <div className="container" dangerouslySetInnerHTML={{ __html: data.body }} />
    </section>

  );
}
