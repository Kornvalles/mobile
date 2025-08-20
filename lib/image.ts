import * as ImageManipulator from "expo-image-manipulator";
export async function prepareImage(uri: string) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1600 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  // ImageManipulator drops EXIF by default when not requested
  return result.uri;
}
