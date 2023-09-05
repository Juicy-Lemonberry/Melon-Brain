import { useEffect, useState } from 'react';
import TopNavbar from '../components/TopNavbar';

type TestData = {
  testman: string[];
};

function MyPage() {
  const [data, setData] = useState<TestData>({ testman: [] });

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <TopNavbar/>
      <h1>My Page</h1>
      <ul>
        {data.testman.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default MyPage;