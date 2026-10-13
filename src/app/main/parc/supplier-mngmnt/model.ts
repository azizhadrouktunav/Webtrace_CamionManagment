import { isNullOrUndefined } from 'util'

export class Supplier {
    ID : number
    Address : string
    Description : string
    IsConstructer : boolean
    IsDeleted : boolean
    Mail : string
    MaxBudget : number 
    Name : string
    Phone : string 
    Responsible1Name : string 
    Responsible2Name : string 
    SaveDate : Date 
    WebSite : string
    supplierString : string
constructor(supplier?) {
    supplier = supplier || {}
    this.ID = supplier.ID || 0 
    this.Address = supplier.Address || ''
    this.Description = supplier.Description || ''
    this.IsDeleted = supplier.IsDeleted || false
    this.Mail = supplier.Mail || ''
    this.MaxBudget = supplier.MaxBudget || 0
    this.Name = supplier.Name || ''
    this.Phone = supplier.Phone || ''
    this.Responsible1Name = supplier.Responsible1Name || ''
    this.Responsible2Name = supplier.Responsible2Name || ''
    this.SaveDate = !isNullOrUndefined(supplier.SaveDate)? new Date(parseInt(supplier.SaveDate.substr(6))) : new Date()
    this.WebSite = supplier.WebSite || ''
    this.IsConstructer = supplier.IsConstructer || false
    this.supplierString = supplier.IsConstructer ? 'constructor' : 'supplier';
   }
} 