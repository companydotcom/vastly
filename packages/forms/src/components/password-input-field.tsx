import React from "react"
import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  InputGroup,
  Icon,
  useDisclosure,
  IconButton,
  InputRightElement,
  useMultiStyleConfig,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/pro-solid-svg-icons"
import { InputFieldProps } from "./input-field"
import { TranslationErrorMessage } from "./translation-error-message"

export const PasswordInputField: React.FC<InputFieldProps> = (props) => {
  const { errors, register, name, label, helperText, formControlStyles, ...rest } = props
  const { isOpen, onToggle } = useDisclosure()
  const styles = useMultiStyleConfig("Input", props)

  const onClickReveal = () => {
    onToggle()
  }

  return (
    <FormControl id={name} isInvalid={errors && !!errors?.[name]} sx={formControlStyles}>
      <FormLabel htmlFor={name}>{label ?? ""}</FormLabel>
      <InputGroup>
        <Input autoComplete="" {...register(name)} type={isOpen ? "text" : "password"} {...rest} />
        <InputRightElement
          padding={0}
          color="transparent"
          // eslint-disable-next-line react/no-children-prop
          children={
            <IconButton
              bg="transparent !important"
              _hover={{ backgroundColor: "none" }}
              variant="unstyled"
              borderTopRightRadius="md"
              borderBottomRightRadius="md"
              borderTopLeftRadius="none"
              borderBottomLeftRadius="none"
              fontSize="1.2em"
              aria-label={isOpen ? "Mask password" : "Reveal password"}
              icon={
                <Icon
                  // @ts-ignore
                  color={styles?.field?._focus?.borderColor ?? "gray.100"}
                  as={FontAwesomeIcon}
                  icon={isOpen ? faEye : faEyeSlash}
                />
              }
              onClick={onClickReveal}
            />
          }
        />
      </InputGroup>
      {helperText && !errors?.[name] && <FormHelperText>{helperText ?? ""}</FormHelperText>}
      {errors && (
        <TranslationErrorMessage errors={errors} name={name}>
          {errors && errors?.[name] && errors?.[name]?.message}
        </TranslationErrorMessage>
      )}
    </FormControl>
  )
}
