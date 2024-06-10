import React, { useState, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import styles from './sign-up.module.scss';

import AssetsAppName from '../../components/assets-app-name/assets-app-name.component';
import AssetsCover from '../../assets/images/ponyui-cover.jpg';

export type SignUpProps = {
  className?: string;
  error?: string;
  // eslint-disable-next-line no-unused-vars
  onSignUp: (email: string) => void;
  loading: boolean;
};

const SignUp: React.FC<SignUpProps> = ({
  className,
  error,
  loading,
  onSignUp,
}) => {
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
  }, []);
  const onClick = useCallback(
    () => isEmailValid && onSignUp(email),
    [email, isEmailValid, onSignUp],
  );

  return (
    <div className={`${styles.signUp} ${className}`}>
      <div className={styles.content}>
        <AssetsAppName className={styles.assetsAppName} />
        <img
          src={AssetsCover}
          alt="assets-cover"
          className={styles.assetsCover}
        />
        <div className={styles.loginForm}>
          <div className={styles.descrBox}>
            <div className={styles.description}>
              PonyUI Assets Export is a free tool, but to use <br />
              it, please subscribe to PonyUI newsletter.
              <br />
              By clicking “Sign Up” you agree with our
            </div>
            <a
              className={styles.policy}
              href="https://ponyui.com/privacypolicy"
              target="blank">
              Privacy Policy
            </a>
          </div>
          <Form.Control
            placeholder="Email"
            className={styles.input}
            onChange={onChange}
            isValid={!!email && isEmailValid}
            isInvalid={!!email && !isEmailValid}
          />
          <Button
            variant="dark"
            className={styles.button}
            onClick={onClick}
            disabled={loading || !isEmailValid}>
            <span>Sign Up</span>
            {loading && (
              <span>
                {' '}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </span>
            )}
          </Button>
          <div className={styles.learnMoreBlock}>
            <div className={styles.learnMoreAbout}>Learn more about</div>
            <a
              className={styles.ponyUiLink}
              href="https://ponyui.com/"
              target="blank">
              PonyUI
            </a>
          </div>
        </div>
      </div>
      {!!error && (
        <Alert variant="danger" dismissible className={styles.alert}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default SignUp;
