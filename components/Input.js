import { useController } from "react-hook-form"
import { TextInput } from "react-native-paper"

export function Input({control, name, rules = {}, label = "", defaultValue = "", ...rest}) {
    const { field } = useController({
        control,
        name: name,
        rules: rules,
        defaultValue: defaultValue.toString(),
    })
    return (
        <TextInput mode="outlined" value={`${field.value}`} onChangeText={field.onChange} label={label} {...rest}/>
    )
}