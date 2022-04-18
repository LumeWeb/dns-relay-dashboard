import fs from "fs";
import { AUTH_LOCATION, ENV_LOCATION } from "../lib/shared";

// @ts-ignore
const Index = ({ pubkey }) => {
  if (pubkey) {
    return <textarea cols={100} rows={3} value={pubkey} readOnly />;
  }
};

export async function getServerSideProps() {
  const authExists = fs.existsSync(AUTH_LOCATION);
  const envExists = fs.existsSync(ENV_LOCATION);

  if (!(authExists && envExists)) {
    return {
      redirect: {
        destination: "/setup",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return {
    props: {
      pubkey: JSON.parse(fs.readFileSync(AUTH_LOCATION) as unknown as string)
        .pub,
    },
  };
}

export default Index;
