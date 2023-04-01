import {Box, Pressable, Text} from "native-base";

const CustomButton = ({ title, onPress, icon, style, customWidth, type = "button" }:any) => {
  return (
    <Pressable style={style} onPress={onPress}>
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
            px={type === "button" ? "20" : "0"}
            bg="tertiary.400:alpha.8"
            py="2"
            shadow={8}
            alignSelf="center"
            w={customWidth != undefined ? customWidth : undefined}
          >
            {icon != undefined ?
              <Box
                w={type === "button" ? "24" : "10"}
                h={type === "icon" ? "6" : undefined}
                alignItems="center"
                justifyContent="center"
                shadow={8}
              >
                {icon}
              </Box>
              :
              <Text color="white" textAlign="center">{title}</Text>
            }
          </Box>
        );
      }}
    </Pressable>
  );
};
export default CustomButton;
