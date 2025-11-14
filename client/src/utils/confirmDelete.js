import Swal from "sweetalert2";

export const confirmDelete = async (message = "This item will be deleted!") => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    background: "#1e1f2b",
    color: "white",
  });

  return result.isConfirmed;
};
