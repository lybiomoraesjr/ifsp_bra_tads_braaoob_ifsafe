import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ChooseImageEnum } from "@/types/enums";

/** Permissão de câmera/galeria negada. */
export class PhotoPermissionError extends Error {}

/** Imagem maior que o limite permitido. */
export class PhotoTooLargeError extends Error {}

/**
 * Seleção e codificação de imagens (câmera ou galeria). Não faz UI: em caso de
 * erro lança exceções tipadas para o chamador decidir como exibir.
 */
export class PhotoService {
  private readonly maxSizeMB = 2;

  /** Retorna a imagem em base64 (data URL) ou `null` se o usuário cancelar. */
  async pick(source: ChooseImageEnum): Promise<string | null> {
    const result =
      source === ChooseImageEnum.OPEN_CAMERA
        ? await this.openCamera()
        : await this.openLibrary();

    if (result.canceled) return null;

    const asset = result.assets[0];
    if (!asset?.uri) return null;

    if (asset.fileSize && asset.fileSize / 1024 / 1024 > this.maxSizeMB) {
      throw new PhotoTooLargeError(
        `A imagem deve ter no máximo ${this.maxSizeMB}MB`
      );
    }

    return this.encode(asset.uri);
  }

  private async openCamera(): Promise<ImagePicker.ImagePickerResult> {
    const status = await ImagePicker.requestCameraPermissionsAsync();
    if (!status.granted) {
      throw new PhotoPermissionError(
        "Precisamos de permissão para acessar a câmera"
      );
    }
    return ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
    });
  }

  private async openLibrary(): Promise<ImagePicker.ImagePickerResult> {
    const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!status.granted) {
      throw new PhotoPermissionError(
        "Precisamos de permissão para acessar a galeria"
      );
    }
    return ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
    });
  }

  private async encode(uri: string): Promise<string> {
    const fileExtension = uri.split(".").pop();
    const base64Image = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/${fileExtension};base64,${base64Image}`;
  }
}
