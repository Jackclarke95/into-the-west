import {
  DefaultButton,
  DefaultEffects,
  DefaultSpacing,
  FontSizes,
  Image,
  Label,
  PrimaryButton,
  Spinner,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import React from "react";
import { useDispatch } from "react-redux";
import DataService from "../Helpers/DataService";

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [password, setPassword] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  const onChangeEmail = (_, value: string | undefined) => {
    setEmail(value);
  };

  const onChangePassword = (_, value?: string | undefined) => {
    setPassword(value);
  };

  const onClickRegister = () => {
    dispatch({
      type: "SetShowRegistrationDialog",
      showRegistrationDialog: true,
    });
  };

  const onClickSignIn = () => {
    if (email && password) {
      DataService.logInWithEmailAndPassword(email, password);

      setLoading(true);
    } else {
      window.alert("Email and/or password required");
    }
  };

  return (
    <Stack
      styles={{
        root: {
          boxShadow: DefaultEffects.elevation16,
          padding: DefaultSpacing.l2,
        },
      }}
    >
      <Image src={process.env.PUBLIC_URL + "logo512.png"} height={256} />
      <Text styles={{ root: { fontSize: FontSizes.superLarge } }}>
        Into the West
      </Text>
      <TextField label="Email" type="email" onChange={onChangeEmail} />
      <TextField
        label="Password"
        type="password"
        onChange={onChangePassword}
        canRevealPassword={false}
      />
      <Stack
        styles={{
          root: {
            paddingTop: DefaultSpacing.m,
            paddingBottom: DefaultSpacing.l1,
          },
        }}
      >
        <PrimaryButton
          text={loading ? "Signing In" : "Sign In"}
          onClick={onClickSignIn}
          disabled={loading}
        >
          {loading && <Spinner />}
        </PrimaryButton>
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
