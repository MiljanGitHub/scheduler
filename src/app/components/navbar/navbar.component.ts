import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mode } from 'src/app/model/mode';
import { User } from 'src/app/model/user';
import { PassingDataService } from 'src/app/services/passing-data.service';
import { TokenStorageService } from 'src/app/services/token-storag.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //helper variables
  public userId : number; // this will be taken from local storage
  public closeResult = '';
  public role = '';
  public user : User;

  constructor(private modalService: NgbModal, private passingDataService : PassingDataService, private tokenStorageService : TokenStorageService, private router: Router) {

  }

  ngOnInit(): void {

    this.passingDataService.loggedInEvent.subscribe(event => {
      
      var user = this.tokenStorageService.getUser();
      if (user){
        this.role = user.role;
        this.user = this.tokenStorageService.getUser();
      } 
    });
   
  }

  public notifyUserComponent(){
     //inform UserComponent about opening Mode
     this.passingDataService.changeMode(Mode.EDIT);

     
  }

  public openUserComponentInRegisterMode(content) {

    //inform UserComponent about opening Mode
    this.passingDataService.changeMode(Mode.REGISTER);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-register'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public openUserComponentInLoginMode(content) {

    //inform UserComponent about opening Mode
    this.passingDataService.changeMode(Mode.LOGIN);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-register'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      
    });
  }

  public createCourt(){
    //inform CourtManagement about opening Mode
    this.passingDataService.changeMode(Mode.REGISTER); //admin is about to create new Court
  }

  public editCourt(){
    //inform CourtManagement about opening Mode
    this.passingDataService.changeMode(Mode.EDIT); //admin is about to edit particular Court
  }

  public logout(){
    this.tokenStorageService.signOut();
    this.role = '';
    this.router.navigate(['/tennis-scheduler']);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
 
  
}
