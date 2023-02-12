import React from "react"
import { useTranslation } from "next-i18next"
import { FormErrorMessage } from "@chakra-ui/react"
import { ErrorMessage } from "@hookform/error-message"

export const TranslationErrorMessage: React.FC<any> = (props) => {
  const { t } = useTranslation()

  return (
    <ErrorMessage
      {...props}
      render={({ message }) => <FormErrorMessage>{t(message)}</FormErrorMessage>}
    />
  )
}
