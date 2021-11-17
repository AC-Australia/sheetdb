// const sqlite3 = require('sqlite3');
// const { open } = require('sqlite');
const Database = require('better-sqlite3');
let db

const getNewDbConnection = async (path) =>{
  try{
    db = new Database(path, { verbose: console.log, fileMustExist: true });
    return
  } catch(err){
    //report Back failed DB Connection and return to settings page
    console.log(err)
    return err
  }
}

const getMaterialsFromDB = async() => {
  const materialSummary = db.prepare("Select * From Materials").all()
  return materialSummary 
}

const getThicknessFromDB = async() => {
  const thicknessSummary = db.prepare("Select id, material_id, thickness, thickness_units, position From thicknesses").all()
  return thicknessSummary 
}

const getSheetsFromDB = async() => {
  const sheets = []
  const sheetSummary = db.prepare("Select * From sheets Where offcut = 1").all()
  sheetSummary.forEach((row) => {
    let measurements = row.shape.split(";");
    if (!row.user_id) row.user_id = "Check With Office"
    const sheet = {
      id: row.id,
      name: row.name,
      dy:measurements[1].split(":")[0] - measurements[0].split(":")[0],
      dx:measurements[2].split(":")[1] - measurements[0].split(":")[1],
      status: row.user_id,
      position: row.position,
      thicknessID: row.thickness_id
    }
    sheets.push(sheet)
  })
  return sheets
}

const putUpdatesize = async(sheet) => {
  //Shape Needs To Look Like This 
  //-8238.921256:-3724.907470;-5798.921256:-3724.907470;-5798.921256:-3489.907470;-8238.921256:-3489.907470;-8238.921256:-3724.907470 ;&
  try{
  const shape = `0:0;${sheet.width}:0;${sheet.width}:${sheet.length};0:${sheet.length};0:0;&`  
  console.log(`Update Sheets Set Shape = '${shape}' Where id = ${sheet.id} and name = '${sheet.name}'`)
  const updatedSheet = db.prepare(`Update Sheets Set Shape = '${shape}' Where id = ${sheet.id} and name = '${sheet.name}'`).run()
  const updatedSheet2 = db.prepare(`Update Sheets Set user_id = '${sheet.status}' Where id = ${sheet.id} and name = '${sheet.name}'`).run()
    return updatedSheet2
  } catch(err) {
    console.log(err)
  }
}

// UPDATE employees
// SET lastname = 'Smith'
// WHERE employeeid = 3;

module.exports.getNewDbConnection = getNewDbConnection
module.exports.getMaterialsFromDB = getMaterialsFromDB
module.exports.getThicknessFromDB = getThicknessFromDB
module.exports.getSheetsFromDB = getSheetsFromDB
module.exports.putUpdatesize = putUpdatesize