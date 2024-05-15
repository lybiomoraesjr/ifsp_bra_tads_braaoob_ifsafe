import React, { ComponentProps } from "react";
import {
  Input as GluestackInput,
  InputField,
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@gluestack-ui/themed";

type InputProps = ComponentProps<typeof InputField> & {
  errorMessage?: string | null;
  isInvalid?: boolean;
  isReadOnly?: boolean;
};

const Input: React.FC<InputProps> = ({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}) => {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb="$3" w="$full">
      <GluestackInput
        isInvalid={isInvalid}
        h="$14"
        borderWidth="$0"
        borderRadius="$md"
        $invalid={{
          borderBottomWidth: 1,
          borderColor: "$canceled",
        }}
        $focus={{
          borderBottomWidth: 1,
          borderColor: invalid ? "$canceled" : "$brandLight",
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
        variant="underlined"
      >
        <InputField
          px="$4"
          color="$gray700"
          placeholderTextColor="$gray400"
          {...rest}
        />
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color="$canceled">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

export default Input;
