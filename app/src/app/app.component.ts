import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto, Sector, Repositor } from 'models';
import { DataService } from 'src/service';

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 title = 'app';
 productos: Producto[] = [];
 sectores: Sector[] = [];
 selectedSector!: Sector;
 repositores: Repositor[] = [];
 selectedRepositor!: Repositor;

 isCheckedSector = false;
 isCheckedRepositor = false;

 constructor(
  private http: HttpClient,
  private dataService: DataService) {}

 ngOnInit() {
   this.loadInitialData();
 }


 mostrarResultados = false

 buscar() {
    this.applyFilter()
    this.mostrarResultados = true
 }

 cancelar() {
   this.mostrarResultados = false
 }


 loadInitialData() {
   this.dataService.getProductos().subscribe((data) => {
    this.productos = data;
  });

  this.dataService.getSectores().subscribe((data) => {
    this.sectores = data;
  });

  this.dataService.getRepositores().subscribe((data) => {
    this.repositores = data;
  });
  }

  applyFilter() {
   //declaro variables para enviar al service
    let repositorToUpdate
    let sectorToUpdate

    //si los checkbox estan habilitados las guarda, sino envia undefined por el que no este, en el service se resuelve
    if(this.isCheckedRepositor)
      repositorToUpdate = this.selectedRepositor

    if(this.isCheckedSector)
      sectorToUpdate = this.selectedSector

    this.dataService
      .getProductos(repositorToUpdate, sectorToUpdate)
      .subscribe((data) => {
        this.productos = data;
      });
  }

  test(valor: any){
    this.selectedSector == valor
    console.log(this.selectedRepositor.id_repositor)
    console.log(this.selectedSector.id_sector)
  }

  test2(){
    console.log(this.selectedRepositor.id_repositor)
    console.log(this.selectedSector.id_sector)
  }

  setRepositor(value: Repositor){
    console.log(value.id_repositor)
    this.selectedRepositor = value
  }

}

