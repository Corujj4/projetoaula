import { Injectable } from '@angular/core';
import {Trilha} from "../model/trilha";
import {Status} from "../model/status";
import Dexie from "dexie";
@Injectable({
  providedIn: 'root'
})
export class TrilhaService extends Dexie {
  trilha: Dexie.Table<Trilha,number>;

  constructor() {
    super('TrilhaDB');
    this.version(1).stores({
      trilha: '' +
        '++id, ' +
        'titulo, ' +
        'dataInicio, ' +
        'dataConclusao, ' +
        'status, ' +
        'descricao, ' +
        'imagem',
    });
    this.trilha = this.table('trilha');
  }

  async adicionarTrilha(trilha: Trilha): Promise<number> {
    return await this.trilha.add(trilha);
  }

  async buscarTrilha(): Promise<Trilha[]>{
    return await this.trilha.toArray();
  }

  async removerTrilha(id:number): Promise<void>{
    return await this.trilha.delete(id);
  }

  async atualizarTrilha(id: number, trilha: Trilha): Promise<number>{
    return await this.trilha.update(id, trilha);
  }

}
