// const inputFile = document.querySelector('input')

// const convert = async (inputFile) => {
//     const icsRes = await fetch(inputFile)
//     const icsData = await icsRes.text()
//     // Convert
//     const data = icsToJson(icsData)
//     return data
// }

// const json = convert(inputFile)
// let dates = []

// console.log(json);

// json.forEach((element,index) => {
//     let date = {
//         startDate: element.startDate,
//         endDate: element.endDate
//     }
//     dates.append(date)
// })
    
    
    
    
    
    //   // On file select (from the pop up)
    //   onFileChange = event => {
      
    //     // Update the state
    //     this.setState({ selectedFile: event.target.files[0]});
    //     console.log("hello from the inside of onFileChange");
    //     console.log(event.target.files[0]);
    //     const icsRes = fetch(event.target.files[0])
    //     const icsData = icsRes.text()
    //         // Convert
    //     const data = icsToJson(icsData)
    //     this.console.log(data)
    //   };
    
      // On file upload (click the upload button)
    //   onFileUpload = () => {
      
    //     // Create an object of formData
    //     const formData = new FormData();

    //     console.log("hello from the inside of onFileUpload");
      
    //     // Update the formData object
    //     // formData.append(
    //     //   "myFile",
    //     //   this.file.selectedFile,
    //     //   this.file.selectedFile.name
    //     // );
      
    //     // Details of the uploaded file
    //     // console.log("hello");
    //     // console.log(this.file.selectedFile);
      
    //     // Request made to the backend api
    //     // Send formData object
    //     // axios.post("api/uploadfile", formData);
    //   };
      
      // File content to be displayed after
      // file upload is complete
    //   fileData = () => {
      
    //     if (this.file.selectedFile) {
           
    //       return (
    //         <div>
    //             <h2>File Details:</h2>
    //             <p>File Name: {this.file.selectedFile.name}</p>
    //             <p>File Type: {this.file.selectedFile.type}</p>
    //             <p>
    //                 Last Modified:{" "}
    //                 {this.file.selectedFile.lastModifiedDate.toDateString()}
    //             </p>
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <div>
    //           <br />
    //           <h4>Choose before Pressing the Upload button</h4>
    //         </div>
    //       );
    //     }
    //   };



                    //     {/* <div>
                    //     <h3>
                    //         File Upload using React!
                    //     </h3>
                    //     <div>
                    //         <input type="file" onChange={this.onFileChange} />
                    //         <button onClick={this.onFileUpload}>
                    //             Upload!
                    //         </button>
                    //     </div> */}
                    //     {/* {this.fileData()} */}
                    // {/* </div> */}




