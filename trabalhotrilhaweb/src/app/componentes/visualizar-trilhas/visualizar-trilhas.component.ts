import { Component, OnInit } from '@angular/core';
import {TrilhaService} from "../../app-core/servicos/trilha-service.service";
import {Trilha} from "../../app-core/model/trilha";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
declare var $ : any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizar-trilhas',
  templateUrl: './visualizar-trilhas.component.html',
  styleUrls: ['./visualizar-trilhas.component.css']
})
export class VisualizarTrilhasComponent implements OnInit {

  i: number =0;
  trilhas: any [] =[];
  trilhaVisualizar: any;
  form: FormGroup;
  constructor(private trilhaService: TrilhaService,
              private fb: FormBuilder) {

    this.form = this.fb.group({
      tituloTrilha: ['', Validators.required],
      dataInicioTrilha: ['', Validators.required],
      dataConclusaoTrilha: ['', Validators.required],
      statusTrilha: ['', Validators.required],
      descricaoTrilha: ['', Validators.required],
      id: [0],
      imagem: ['']
    });
  }

  openModal(){
    $('#add-trilha').modal('show');
  }
  closeModal(){
    $('#add-trilha').modal('hide');
  }
  salvarFormTrilha() {
    if(this.form.valid){
     const novaTrilha: Trilha = new Trilha(
       this.form.value.tituloTrilha,
       this.form.value.dataInicioTrilha,
       this.form.value.dataConclusaoTrilha,
       this.form.value.descricaoTrilha,
       this.form.value.statusTrilha,
       undefined,
       this.form.value.imagem
     );
     console.log('dados da nova trilha: ',novaTrilha);
     this.trilhaService.adicionarTrilha(novaTrilha).then(reposta => {
       if(reposta > 0){
         Swal.fire('Sucesso', 'Trilha salva com sucesso!', 'success');
         this.form.reset();
         this.closeModal();
         this.listarTrilhas();
       }
     }).catch(respostaError => {
       Swal.fire('Não foi dessa vez', 'Não foi possível salvar a trilha, ' +
         'tente novamente mais tarde', 'error');
       console.log(respostaError);
     })
    }else{
      console.log("CAMPOS INVALIDOS ENCONTRADOS.");
      console.log("DADOS DOS CAMPOS: ", this.form.value);
      Swal.fire('Cuidado', 'Alguns campos do formulário não estão ' +
        'corretos.', 'warning');
      this.marcarTodosComoClicados();
    }
  }
  isCampoValido(inputNome: string) : boolean {
    const campo: any = this.form.get(inputNome);
    return campo && campo.touched && campo.invalid;
  }
  marcarTodosComoClicados(){
    Object.values(this.form.controls).forEach(campo => {
      campo.markAsTouched();
    });
  }
  listarTrilhas(){
    this.trilhaService.buscarTrilha().then(resposta => {
      this.trilhas= resposta;
    });
  }

  setTrilhaAtual(trilha: Trilha){
    this.trilhaVisualizar= trilha;
  }

  excluirTrilha(id: number){
    Swal.fire(
      {
        title: 'Tem certeza?',
        text: 'Você não poderá reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, deletar trilha!',
        confirmButtonColor: '#3085d6'
      }).then((tipoBotao) => {
        if(tipoBotao.isConfirmed){
          this.trilhaService.removerTrilha(id).then(() => {
            Swal.fire('Deletado!', 'A trilha foi deletada.', 'success');
            this.listarTrilhas();
          });
        }
    }).catch(error => {
      console.log(error);
      Swal.fire('ERRO!', 'A trilha não foi deletada.', 'error')
    });
  }

  submitForm(){
    if(this.form.value.id > 0){
      this.editarFormTrilha();
    }else{
      this.salvarFormTrilha();
    }
  }
  carregarDadosTrilha(trilhaEditar: Trilha){
    this.form.patchValue({
      tituloTrilha: trilhaEditar.titulo,
      dataInicioTrilha: trilhaEditar.dataInicio,
      dataConclusaoTrilha: trilhaEditar.dataConclusao,
      statusTrilha: trilhaEditar.status,
      descricaoTrilha: trilhaEditar.descricao,
      id: trilhaEditar.id,
      imagem: trilhaEditar.imagem
    });
    this.openModal();
  }

  editarFormTrilha(){
    if(this.form.valid){
      const editarTrilha: Trilha = new Trilha(
        this.form.value.tituloTrilha,
        this.form.value.dataInicioTrilha,
        this.form.value.dataConclusaoTrilha,
        this.form.value.descricaoTrilha,
        this.form.value.statusTrilha,
        this.form.value.id,
        this.form.value.imagem
      );
      this.trilhaService.atualizarTrilha(this.form.value.id, editarTrilha)
        .then(reposta => {
          if(reposta === 1){
            Swal.fire('Sucesso!','Trilha editada com sucesso.','success');
            this.form.reset();
            this.closeModal();
            this.listarTrilhas();
          }else{
            Swal.fire('Atenção','Nenhuma trilha encontrada, ou nenhuma alteração' +
              ' necessária', 'info');
          }
        }).catch(error => {
         Swal.fire('Cuidado!', 'Não foi possível editar a trilha.', 'error');
      });
    }else{
      Swal.fire('Cuidado!', 'Alguns campos estão incorretos', 'warning');
      this.marcarTodosComoClicados();
    }
  }

  onFileChange(event: any){
    const file = event.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        this.form.patchValue({imagem: loadEvent?.target?.result});
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
      this.listarTrilhas();
  }

}
