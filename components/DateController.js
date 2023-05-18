import RNDateTimePicker from "@react-native-community/datetimepicker"
import { useEffect, useState } from "react"
import { useController } from "react-hook-form"
import { TextInput } from "react-native-paper"

export function DateController({control, name, modalName, rules = {}, defaultValue = new Date(), open, setOpen, ...rest}) {
    const { field } = useController({
        control,
        name: name,
        rules: rules,
        defaultValue: defaultValue,
    })
    
    const [isOpen, setIsOpen] = useState(open)

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    return (
        open && isOpen && <RNDateTimePicker value={field.value} onChange={(e, v) => {
            setIsOpen(false)
            setOpen(prev => ({...prev, [`${modalName ?? name}`]: false}))

            if(e.type !== "dismissed") {
                field.onChange(v)
            }
        }
        } {...rest}/>
    )
}