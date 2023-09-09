import config from '@/config';
import ExampleForm from '@/components/example/ExampleForm';
import Separator from '@/components/Separator';

async function getBackendData(backendURL: string) {
    const res = await fetch(
        backendURL, // Routes to the '/api/example/postgres' in 'server.js'.'
        { cache: 'no-store' } // Flag to ensure that the data is constantly re-fetched.
      );

    const data = await res.json();
    return data["result"] as any[];
}

async function ExamplePage() {
  const postgresData = await getBackendData(`${config.API_BASE_URL}/api/example/postgres`);
  const mongoData = await getBackendData(`${config.API_BASE_URL}/api/example/mongodb/get`);
  /*If you try to have two different tags in one page, 
    you may get an error. "JSX cannot have 2 parent tags"
    Hence, you can use an empty '<>' tag as the parent*/
  return (
    <>
      <h1>Example for PostgreSQL</h1>
      { /* Use &ldquo; and &rdquo; for left and right qutotation marks...*/}
      <b>&ldquo;example&rdquo; table content in PostgreSQL:</b>
      <ul>
        {postgresData?.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>

      {/* See 'components/example/ExampleForm.tsx'. */}
      {/* Also, note that this is imported at the top. */}
      <ExampleForm endpointUrl={`${config.API_BASE_URL}/api/example/postgres`} />
      <Separator/>

      <h1>Example for MongoDB</h1>
      <b>&ldquo;example&rdquo; collection content in MongoDB:</b>
      <ul>
        {mongoData?.map((item, index) => {
          return <li key={index}>{item["sampleContent"]}</li>;
        })}
      </ul>
      
      <ExampleForm endpointUrl={`${config.API_BASE_URL}/api/example/mongodb/post`} />
    </>
  );
}

export default ExamplePage;