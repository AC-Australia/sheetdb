// const sqlite3 = require('sqlite3');
// const { open } = require('sqlite');
const Database = require('better-sqlite3');
let db

const getNewDbConnection = (locPath) =>{
  try{
    db = new Database(locPath, { verbose: console.log, fileMustExist: true });
    console.log("Connected")
    // return 
  } catch(err){
    console.log("ERRORING")
    throw new Error("Cant Connect File Does Not Exist Or Permissions Not Set")
  }
  try {
    conditionDB()
  } catch(err) {
    console.log(err)
  }
  return 
}

const conditionDB = () => {
  try{
    const dbUpdatedStatus = db.prepare(`Update Sheets Set user_id = 'Pending' Where offcut = 1 and user_id = ''`).run()
    const sheetSummary = db.prepare("Select * From sheets Where offcut = 1").all()
    sheetSummary.forEach((row) => {
      const name = row.name.split("(")
      db.prepare(`Update Sheets Set name = '${name[0]}(${row.user_id})' Where id = ${row.id}`).run()
    })
    return dbUpdatedStatus
  } catch(err){
    console.log("ERRORING", err)
    throw new Error("Failed To Set DB Condtion")
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
      visName: row.name.split("(")[0],
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

// Code to Create new Sheet. Will Need to add name somehow 
//INSERT INTO "sheets" ("thickness_id", "offcut", "shape", "user_id") VALUES
//('4', '0', '0:0;2285:0;2285:465;0:465;0:0;&', 'Reserved');


const putUpdatesize = async(sheet) => {
  //Shape Needs To Look Like This 
  //-8238.921256:-3724.907470;-5798.921256:-3724.907470;-5798.921256:-3489.907470;-8238.921256:-3489.907470;-8238.921256:-3724.907470 ;&
  try{
  const shape = `0:0;${sheet.width}:0;${sheet.width}:${sheet.length};0:${sheet.length};0:0;&`  
  console.log(`Update Sheets Set Shape = '${shape}' Where id = ${sheet.id} and name = '${sheet.name}'`)
  const updatedSheet = db.prepare(`Update Sheets Set Shape = '${shape}' Where id = ${sheet.id} and name = '${sheet.name}'`).run()
  const updatedSheet2 = db.prepare(`Update Sheets Set user_id = '${sheet.status}' Where id = ${sheet.id} and name = '${sheet.name}'`).run()
  conditionDB()
    return updatedSheet2
  } catch(err) {
    console.log(err)
  }
}

const putaddNewMaterial = async(sheet) => {
  try{
  const matchingSheets = await db.prepare(`Select * From Sheets Where thickness_id = ${sheet.thickID} and offcut = 1`).all()
  if(matchingSheets.length >= 1){
  const latestSheet = matchingSheets[matchingSheets.length - 1]
  const materialName = latestSheet.name.split(/([0-9]*[x][0-9]*)\w+/)[0]
  const recentOffcutNumber = latestSheet.name.split('Offcut ')[1].split('(')[0]
  const sheetShape = `0:0;${sheet.width}:0;${sheet.width}:${sheet.length};0:${sheet.length};0:0;&`
  const sheetName = `${materialName} ${sheet.length}x${sheet.width}, Offcut ${parseInt(recentOffcutNumber) + 1} (${sheet.status})`
  const newSheet = await db.prepare(`INSERT INTO "sheets" ("thickness_id", "offcut", "width", "height", "units", "shape", "grain_direction", "user_id", "cost_per_sheet", "quantity", "name", "inherit_cost", "num_reserved", "position") VALUES (${sheet.thickID},1,0,0,'${latestSheet.units}','${sheetShape}',${latestSheet.grain_direction},'${sheet.status}',${latestSheet.cost_per_sheet},1,'${sheetName}',${latestSheet.inherit_cost},${latestSheet.num_reserved},0)`).run()
  return newSheet
  } else {
    console.log("Eventually Deal with Sheets that do not already have offcuts")
    return "No Existing Sheets"
  }
  } catch(err) {
    console.log("ERR", err)
  }
}

const putDeletesize = async(sheet) => {
  console.log("Removing Sheet", sheet)
  try{
    const removedSheet = db.prepare(`Delete From sheets Where id = '${sheet.id}' and name = '${sheet.name}'`).run()
    console.log(removedSheet)
    return removedSheet
  } catch(err){
    console.log(err)
  }
}


module.exports.getNewDbConnection = getNewDbConnection
module.exports.getMaterialsFromDB = getMaterialsFromDB
module.exports.getThicknessFromDB = getThicknessFromDB
module.exports.getSheetsFromDB = getSheetsFromDB
module.exports.putUpdatesize = putUpdatesize
module.exports.putDeletesize = putDeletesize
module.exports.conditionDB = conditionDB
module.exports.putaddNewMaterial = putaddNewMaterial