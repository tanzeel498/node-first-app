const deleteProduct = (btn) => {
  const productId = btn.parentElement.querySelector("[name=productId]").value;
  const productEl = btn.closest("article");

  fetch(`/admin/product/${productId}`, { method: "DELETE" })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      if (data.message === "Success") productEl.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};
