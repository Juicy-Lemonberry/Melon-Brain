import config from '@/config';
import ExampleForm from '@/components/example/ExampleForm';

async function getPostgresData() {
    const res = await fetch(
      `${config.API_BASE_URL}/api/example/postgres`, // Routes to the '/api/example/postgres' in 'server.js'.'
        { cache: 'no-store' } // Flag to ensure that the data is constantly re-fetched.
      );

    const data = await res.json();
    return data["result"] as any[];
}

async function ExamplePage() {
  const testData = await getPostgresData();

  /*If you try to have two different tags in one page, 
    you may get an error. "JSX cannot have 2 parent tags"
    Hence, you can use an empty '<>' tag as the parent*/
  return (
    <>
      <div>
        <h1>Example Page</h1>
        <b>Test, `example` table content:</b>
        <ul>
          {testData?.map((item, index) => {
            console.log(item);
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </div>

      {/* See 'components/example/ExampleForm.tsx'. */}
      {/* Also, note that this is imported at the top. */}
      <ExampleForm/>
    </>
  );
}

export default ExamplePage;