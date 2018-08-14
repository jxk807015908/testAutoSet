function  a() {
  return new Promise(resolve => {
    resolve(1);
  })
}
a().then(res=>{
  console.error(res);
})
