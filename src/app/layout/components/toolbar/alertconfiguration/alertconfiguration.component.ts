export class ItemFlatNode {
  constructor(
    public expandable: boolean,
    public id: number,
    public name: string,
    public level: number) { }
}
export class ItemNode {
  id: number;
  name: string;
  children: ItemNode[];

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { element } from 'protractor';
import { of as observableOf } from 'rxjs';
import { of as ofObservable, Observable, BehaviorSubject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { DATA } from '../tree/dataAccess';
import { TreeBuilder } from '../tree/tree-builder';
import { AlertconfigurationShowedInNotificationService } from './alertconfiguration-showed-in-notification.service';

@Component({
  selector: 'app-alertconfiguration',
  templateUrl: './alertconfiguration.component.html',
  styleUrls: ['./alertconfiguration.component.scss'],
  providers: [TreeBuilder]
})
export class AlertconfigurationComponent {

  treeControl: FlatTreeControl<ItemFlatNode>;
  treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
  checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */);
  alertConfigs = [];
  enabledAlertsId = [];
  selected: any;
  alertconf = {};
  deselect: (...values: ItemFlatNode[]) => void;
  data: any;

  constructor(
    public matDialogRef: MatDialogRef<AlertconfigurationComponent>,
    private translateService: TranslateService,
    private _database: TreeBuilder,
    private _AlertconfigurationShowedInNotificationService: AlertconfigurationShowedInNotificationService,
    private _snackBar: MatSnackBar,

  ) {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<ItemFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    _database.dataChange.subscribe(data => this.dataSource.data = data);
    this._AlertconfigurationShowedInNotificationService.getCommonAlertWithDescriptionShowedInNotificationState().subscribe((data: any[]) => {
     
      data["GetCommonAlertWithDescriptionShowedInNotificationStateResult"].forEach(element => {
        
        if(element["Value"] == true)
        this.enabledAlertsId.push(element["Key"]["CommonAlertInt"]);

      });
      this.enabledAlertsId.forEach(element => {
        for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
          if (this.treeControl.dataNodes[i].id == element) {
            this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
            this.treeControl.expand(this.treeControl.dataNodes[i])
          }

        }
      });
    }
    )


  }

  transformer = (node: ItemNode, level: number) => {
    return new ItemFlatNode(!!node.children, node.id, node.name, level);
  }
  private _getLevel = (node: ItemFlatNode) => node.level;

  private _isExpandable = (node: ItemFlatNode) => node.expandable;

  private _getChildren = (node: ItemNode): Observable<ItemNode[]> => observableOf(node.children);

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: ItemFlatNode): void {

    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }
  ngAfterViewInit() {
    this.treeControl.expandAll();
  }
  saveConfiguration() {
    
    this.selected = this.checklistSelection.selected;

    // DATA[0]["children"].forEach(elm => {
    this.selected.forEach(element => {
      this.alertconf[element.id] = {};
      Object.assign(this.alertconf[element.id], { commonAlertValue: element.id, visible: true });

      this.alertConfigs.push(this.alertconf[element.id]);
      
      this.translateService.get(['NAV.configok', 'NAV.configfail'])
      .subscribe(data => { this.data = data }
      );

      
      });

    
      DATA[0]["children"].forEach(elm => {
        const found = this.alertConfigs.some(el => el['commonAlertValue'] === elm['id']);
        if (!found)
          { this.alertconf[elm.id] = {};
            Object.assign(this.alertconf[elm.id], { commonAlertValue: elm.id, visible: false });

        this.alertConfigs.push(this.alertconf[elm.id]);}
      });
      this._AlertconfigurationShowedInNotificationService.updateShowedAlarmInRTCfg(this.alertConfigs).subscribe((data: any[]) => {

        if (data["UpdateShowedAlarmInRTCfgResult"] == true) {


          this._snackBar.open(this.data['NAV.configok'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration: 2000
          })
        }
        else {
          this._snackBar.open(this.data['NAV.configfail'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration: 2000
          })
        }

    }

    );

    // });

    this.matDialogRef.close();
  }
}



