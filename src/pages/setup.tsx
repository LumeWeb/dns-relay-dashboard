import { Button, Container, Form } from "react-bootstrap";
import { Formik } from "formik";
import { ENV_LOCATION, LOCK_LOCATION, setupSchema } from "../lib/shared";
import { useRef } from "react";
import { parse } from "envfile";
import fs from "fs";

// @ts-ignore
const Setup = ({ locked, appId, appSecret, domain, email }) => {
  const schema = setupSchema();
  const formEl = useRef(null);
  if (locked) {
    return (
      <Container>
        Please delete lock file at <pre>/opt/dnsrelay/data/.lock</pre> to update
        configuration
      </Container>
    );
  }

  return (
    <Container>
      <Formik
        validationSchema={schema}
        // @ts-ignore
        initialValues={{
          appId,
          appSecret,
          domain,
          email,
        }}
        // @ts-ignore
        onSubmit={(state, methods) => formEl.current.submit()}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form
            onSubmit={handleSubmit}
            action="/api/setup"
            method="post"
            ref={formEl}
          >
            <Form.Group className="mb-3">
              <Form.Label>Pocket Network App ID</Form.Label>
              <Form.Control
                name="appId"
                required
                type="text"
                placeholder="Enter ID"
                onChange={handleChange}
                value={values.appId}
                isValid={touched.appId && !errors.appId}
              />
              <Form.Text className="text-muted">
                This will be listed in your app settings as <pre>Portal ID</pre>
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pocket Network App Secret</Form.Label>
              <Form.Control
                name="appSecret"
                required
                type="text"
                placeholder="Enter Secret"
                onChange={handleChange}
                value={values.appSecret}
                isValid={touched.appSecret && !errors.appSecret}
              />
              <Form.Text className="text-muted">
                This will be listed in your app settings as{" "}
                <pre>Secret Key</pre>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Relay Domain</Form.Label>
              <Form.Control
                name="domain"
                required
                type="text"
                placeholder="Enter Domain"
                onChange={handleChange}
                value={values.domain}
                isValid={touched.domain && !errors.domain}
              />
              <Form.Text className="text-muted">
                Provide the domain for your relay to configure SSL. Do not enter
                https(s) or any url.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                name="email"
                required
                type="email"
                placeholder="Enter E-Mail"
                onChange={handleChange}
                value={values.email}
                isValid={touched.email && !errors.email}
              />
              <Form.Text className="text-muted">
                Provide your email for creating your relay SSL
              </Form.Text>
            </Form.Group>
            <Button type="submit">Save</Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Setup;

const isLocked = () => {
  const fs = require("fs");
  return fs.existsSync(LOCK_LOCATION);
};

export async function getServerSideProps() {
  const fs = require("fs");
  const locked = isLocked();

  const props = { locked };

  if (!locked && fs.existsSync(ENV_LOCATION)) {
    const env = parse(fs.readFileSync(ENV_LOCATION));
    // @ts-ignore
    props.appId = env.POCKET_APP_ID ?? null;
    // @ts-ignore
    props.appSecret = env.POCKET_APP_KEY ?? null;
    // @ts-ignore
    props.domain = env.DOMAIN ?? null;
    // @ts-ignore
    props.email = env.EMAIL ?? null;
  }

  return {
    props,
  };
}
