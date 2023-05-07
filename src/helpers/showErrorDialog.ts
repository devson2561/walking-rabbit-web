import { AxiosError } from "axios";
import Swal from "sweetalert2";

export const showErrorDialog = (error: any, title = "Error") => {
  let message = "";
  console.log(error, " <----- error");

  if (error instanceof AxiosError) {
    message =
      error.response?.data?.message ??
      error.response?.data?.title ??
      error?.message;
  } else {
    message = error?.message ?? error;
  }

  Swal.fire(title, message, "error");
};
