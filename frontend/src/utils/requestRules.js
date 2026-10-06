export function validateRequestForm(form) {
  if (!form.title.trim()) return "A title is required";
  if (form.title.trim().length < 5) return "Title should be at least 5 characters";
  if (!form.description.trim()) return "A description is required";
  if (form.description.trim().length < 10) return "Description should be at least 10 characters";
  if (!form.category) return "Choose a category";
  return "";
}
