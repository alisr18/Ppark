import RNDateTimePicker from "@react-native-community/datetimepicker"
import { useController } from "react-hook-form"
import { TextInput } from "react-native-paper"

export function DateController({control, name, rules = {}, defaultValue = new Date(), open, minimumDate = new Date(), ...rest}) {
    const { field } = useController({
        control,
        name: name,
        rules: rules,
        defaultValue: defaultValue,
    })
    return (
        open && <RNDateTimePicker minimumDate={minimumDate} value={field.value} onChangeText={field.onChange} {...rest}/>
    )
}