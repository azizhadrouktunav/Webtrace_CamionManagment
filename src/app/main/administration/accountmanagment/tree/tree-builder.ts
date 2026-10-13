class ItemNode {
    id: number;
    name: string;
    children: ItemNode[];
  
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  }
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { DATA } from './dataAccess';
/**
 * This class transforms a data array into structured tree
 */

@Injectable()
export class TreeBuilder {
   dataChange = new BehaviorSubject<ItemNode[]>([]);
  
  get data(): ItemNode[] { return this.dataChange.value; }
  
  constructor() {
    this.initialize();
  }

  initialize() {
    
    const data = this.builTree(DATA, 0);
    this.dataChange.next(data);
  }

  builTree(obj: any, level: number): ItemNode[] {
    return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new ItemNode(value.id, value.name);
      
      if (value != null) {
        if (typeof value === 'object') {
          if (value.children !== undefined) {
            node.children = this.builTree(value.children, level + 1);
          }
       
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}