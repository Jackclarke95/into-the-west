import {
  DefaultButton,
  DefaultEffects,
  DefaultSpacing,
  FontSizes,
  Image,
  Label,
  Link,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { getAuth } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import DataService from "../Helpers/DataService";

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [password, setPassword] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [messageBarMessage, setMessageBarMessage] = React.useState<
    string | undefined
  >(undefined);
  const [messageBarType, setMessageBarType] = React.useState<MessageBarType>(
    MessageBarType.info
  );

  const onChangeEmail = (_, value: string | undefined) => {
    setEmail(value);
  };

  const onChangePassword = (_, value?: string | undefined) => {
    setPassword(value);
  };

  /**
   * Click handler for the Register button
   */
  const onClickRegister = () => {
    dispatch({
      type: "SetShowRegistrationDialog",
      showRegistrationDialog: true,
    });
  };

  /**
   * Validates whether an email is valid
   * @param email The email to validate
   * @returns Whether the email is valid
   */
  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  /**
   * Click handler for the Sign In button
   */
  const onClickSignIn = async () => {
    if (!email || !validateEmail(email)) {
      setMessageBarMessage("Invalid email");
      setMessageBarType(MessageBarType.error);
    } else if (!password) {
      setMessageBarMessage("Please enter a password");
      setMessageBarType(MessageBarType.error);
    } else {
      setLoading(true);

      DataService.logInWithEmailAndPassword(email, password).catch(
        (error: Error) => {
          setLoading(false);
          setMessageBarType(MessageBarType.error);

          if (
            error.message.includes("auth/invalid-email") ||
            error.message.includes("auth/wrong-password")
          ) {
            setMessageBarMessage("Email and/or password incorrect");
          } else if (error.message.includes("auth/too-many-requests")) {
            setMessageBarMessage(
              "Too many attempts; please try again later, or reset your password"
            );
          } else {
            setMessageBarMessage(error.message);
          }
        }
      );
    }
  };

  /**
   * Click handler for resetting the password
   */
  const onClickResetPassword = async () => {
    if (!email || !validateEmail(email)) {
      setMessageBarMessage("Invalid email");
      setMessageBarType(MessageBarType.error);
    } else {
      await DataService.resetPassword(getAuth(), email)
        .then(() => {
          setMessageBarMessage("Password reset email sent");
          setMessageBarType(MessageBarType.success);
        })
        .catch((error) => {
          setMessageBarMessage(error.message);
          setMessageBarType(MessageBarType.error);
        });
    }
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onClickSignIn();
    }
  };

  return (
    <Stack
      styles={{
        root: {
          boxShadow: DefaultEffects.elevation16,
          padding: DefaultSpacing.l2,
          backgroundColor: "white",
          width: "320px",
        },
      }}
    >
      <Image src={process.env.PUBLIC_URL + "logo512.png"} height={256} />
      <Text styles={{ root: { fontSize: FontSizes.superLarge } }}>
        Into the West
      </Text>
      {messageBarMessage && (
        <MessageBar
          messageBarType={messageBarType}
          styles={{
            root: {
              maxWidth: "240px",
            },
          }}
        >
          {messageBarMessage}
        </MessageBar>
      )}
      <TextField
        label="Email"
        type="email"
        onChange={onChangeEmail}
        onKeyPress={onKeyPress}
      />
      <TextField
        label="Password"
        type="password"
        onChange={onChangePassword}
        canRevealPassword
        onKeyPress={onKeyPress}
      />
      <Stack
        styles={{
          root: {
            paddingTop: DefaultSpacing.m,
            paddingBottom: DefaultSpacing.m,
          },
        }}
      >
        <PrimaryButton
          text={loading ? "Signing in" : "Sign in"}
          onClick={onClickSignIn}
          disabled={loading}
        >
          {loading && <Spinner />}
        </PrimaryButton>
        <Label>
          Forgot password? You can reset it{" "}
          <Link onClick={onClickResetPassword}>here</Link>
        </Label>
      </Stack>
      <Label>No account? Register here:</Label>
      <DefaultButton
        text="Register"
        onClick={onClickRegister}
        disabled={loading}
      />
    </Stack>
  );
};

export default Login;
