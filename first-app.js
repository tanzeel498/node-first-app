const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("fetch Done...");
    }, 1000);
  });
  return promise;
};

setTimeout(() => {
  console.log("Timed out!!");
  fetchData()
    .then((text) => {
      console.log(text);
      return fetchData();
    })
    .then((text) => console.log(text));
}, 2000);

console.log("Hello!");
console.log("Hi");
