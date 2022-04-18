import {
  DefaultButton,
  DefaultEffects,
  DefaultSpacing,
  Dialog,
  FontSizes,
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
      <Text styles={{ root: { fontSize: FontSizes.superLarge } }}>
        Into the West
      </Text>
      <TextField label="Email" onChange={onChangeEmail} />
      <TextField
        label="Password"
        type="password"
        onChange={onChangePassword}
        canRevealPassword={false}
      />
      <PrimaryButton
        text={loading ? "Signing In" : "Sign In"}
        onClick={onClickSignIn}
        disabled={loading}
      >
        {loading && <Spinner />}
      </PrimaryButton>
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
