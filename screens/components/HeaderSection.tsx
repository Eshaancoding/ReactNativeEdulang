import {  MaterialIcons } from "@expo/vector-icons";
import {Box, Heading, Pressable, Icon,} from "native-base";

export function HeaderSection(props:any) {
  return (
    <Box flexDirection="row" justifyContent="space-between" my="6" mx="4">
      <Heading color="info.500">{props.title}</Heading>

      {props.buttonTitle != undefined && (
        <Pressable onPress={props.onButtonClick}>
          {({ isPressed }) => {
            return (
              <Box
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.9 : 1,
                    },
                  ],
                }}
                rounded="full"
                bg="tertiary.400:alpha.8"
                shadow={8}
              >
                <Icon
                  as={<MaterialIcons name="add" />}
                  size={5}
                  m="2"
                  color="tertiary.600"
                  alignSelf="center"
                />
              </Box>
            );
          }}
        </Pressable>
      )}
    </Box>
  );
}