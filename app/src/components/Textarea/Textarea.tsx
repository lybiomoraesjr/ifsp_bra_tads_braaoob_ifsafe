import { FormControl, FormControlLabelText } from "@gluestack-ui/themed";
import { FormControlErrorText } from "@gluestack-ui/themed";
import { FormControlLabel } from "@gluestack-ui/themed";
import { FormControlError } from "@gluestack-ui/themed";
import {
  Textarea as GluestackTextarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import React, { ComponentProps } from "react";

type TextareaProps = ComponentProps<typeof TextareaInput> & {
  isInvalid?: boolean;
  placeholder: string;
  errorMessage?: string | null;
  title?: string;
};

const Textarea: React.FC<TextareaProps> = ({
  isInvalid = false,
  placeholder,
  errorMessage,
  title,
  ...rest
}) => {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl mb="$3" w="$full">
      {title && (
        <FormControlLabel>
          <FormControlLabelText fontWeight="$bold">{title}</FormControlLabelText>
        </FormControlLabel>
      )}

      <GluestackTextarea
        size="md"
        isInvalid={invalid}
        w="$full"
        borderWidth="$0"
        borderBottomWidth="$1"
        borderRadius="$md"
        $invalid={{
          borderBottomWidth: 1,
          borderColor: "$canceled",
        }}
        $focus={{
          borderBottomWidth: 1,
          borderColor: invalid ? "$canceled" : "$brandLight",
        }}
      >
        <TextareaInput placeholder={placeholder} {...rest} />
      </GluestackTextarea>

      <FormControlError>
        <FormControlErrorText color="$canceled">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

export default Textarea;
