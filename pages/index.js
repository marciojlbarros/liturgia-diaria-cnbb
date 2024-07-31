import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../src/app/styles.css';
import { format } from 'date-fns';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reading, setReading] = useState(null);
  const [fontSize, setFontSize] = useState(16); // Estado para o tamanho da fonte

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

  useEffect(() => {
    if (data && selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const fetchReading = async () => {
        try {
          const response = await fetch(`https://api-liturgia.edicoescnbb.com.br/contents/in/date/${dateString}`);
          const result = await response.json();
          setReading(result.content || {});
        } catch (err) {
          setError(err.message);
        }
      };

      fetchReading();
    }
  }, [selectedDate, data]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 8)); // Define um tamanho mínimo de 8px
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="container">
      <div className="layout">
        <div className="reading-container" style={{ fontSize: `${fontSize}px` }}>
          <div className="controls">
            <button onClick={decreaseFontSize}>A-</button>
            <button onClick={increaseFontSize}>A+</button>
          </div>
            {reading ? (
              <>
                <div className="container" dangerouslySetInnerHTML={{ __html: reading.details }} />
                <div className="container" dangerouslySetInnerHTML={{ __html: reading.body }} />
                <div className="container"><p className='titleP'>Conferência Nacional dos Bispos do Brasil<br></br>
                © Todos os direitos reservados.</p></div>
              </>
            ) : (
              <div>Select a date to see the reading</div>
            )}
        </div>
          <div className="calendar-container react-calendar">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
            />
          </div>
      </div>
    </section>
  );
}
