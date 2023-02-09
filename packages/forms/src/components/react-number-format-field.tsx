import * as React from "react"

// import React from 'react';
// import NumberFormat, { NumberFormatProps } from 'react-number-format';
// import {
//   __DEV__,
//   FormControl,
//   FormLabel,
//   FormHelperText,
//   HTMLPotionProps,
//   ThemingProps,
//   Input,
//   Skeleton,
// } from '@companydotcom/potion';
// import { Controller, Control, FieldErrors } from 'react-hook-form';
// import { TranslationErrorMessage } from './translation-error-message';

// export interface ReactNumberFormatFieldProps extends NumberFormatProps {
//   /** Control object from react-hook-form */
//   control: Control<any>;
//   /** Field name */
//   name: string;
//   /** Field label */
//   label?: string;
//   /** Field helper text */
//   helperText?: string;
//   /** Used to style the form control, which contains the entire component */
//   formControlStyles?: HTMLPotionProps<'div'> & ThemingProps<'FormControl'>;
//   /** Errors object from react-hook-form formState */
//   errors?: FieldErrors<any>;
//   /** Current loading state for the input field */
//   isLoading?: boolean;

//   isReadOnly?: boolean;
// }

// export const ReactNumberFormatField: React.FC<ReactNumberFormatFieldProps> = props => {
//   const {
//     name,
//     label,
//     helperText,
//     control,
//     formControlStyles,
//     errors,
//     isLoading,
//     isReadOnly,
//     ...rest
//   } = props;

//   return (
//     <Controller
//       control={control}
//       name={name}
//       render={({ field: { onChange, onBlur, value, name }, fieldState: { invalid, error } }) => (
//         <FormControl isInvalid={invalid} id={name} sx={formControlStyles}>
//           <FormLabel htmlFor={name}>{label ?? ''}</FormLabel>
//           <Skeleton isLoaded={!isLoading}>
//             <NumberFormat
//               isReadOnly={isReadOnly}
//               customInput={Input}
//               name={name}
//               value={value}
//               onChange={onChange}
//               onBlur={onBlur}
//               {...rest}
//             />
//           </Skeleton>
//           {helperText && !error && <FormHelperText>{helperText ?? ''}</FormHelperText>}
//           {errors && (
//             <TranslationErrorMessage errors={errors} name={name}>
//               {errors && errors?.[name] && errors?.[name]?.message}
//             </TranslationErrorMessage>
//           )}
//         </FormControl>
//       )}
//     />
//   );
// };

// if (__DEV__) {
//   ReactNumberFormatField.displayName = 'ReactNumberFormatField';
// }
