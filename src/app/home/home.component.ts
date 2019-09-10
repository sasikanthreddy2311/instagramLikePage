import { Component, OnInit, Input} from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  photos: any[] = [];
  page: number = 1; 

  constructor(private http: HttpClient, private modalService: NgbModal) { }

  ngOnInit() {
    this.getRandomPhotos();
  }

  getRandomPhotos = function() {
    let headers = new HttpHeaders({
      'Authorization': 'Client-ID e4b42a6225d354120f69538d981c718b9de8613bd21e57398e0997c25ed6f9f2'
    });
    let options = {
      headers: headers
    }
  
    return this.http.get('https://api.unsplash.com/photos/?page='+this.page, options).subscribe((data: any) => this.onSuccess(data)
    )
  }

  onSuccess(res) {   
    if (res != undefined) {  
      res.forEach(item => {  
        this.photos.push(item);  
      });  
    }  
  } 

  onScroll()  
  {    
    this.page = this.page + 1;  
    this.getRandomPhotos();  
  }

  openModal = function(url) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.imageSrc = url;
    console.log(url);
  }

}

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header" style="background: beige;background: deepskyblue;">
      <h6 class="modal-title">Image!</h6>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <img src="{{imageSrc}}" class="zoom img-fluid " style="height: 400px;width: 470px; padding-bottom: 10px;cursor: pointer;"
      alt="image">
    </div>
    <div class="modal-footer" style="background: deepskyblue;">
      <span *ngIf="!liked"><i title="like" style="color: white;padding-bottom: 15px;" class="fa fa-thumbs-up" (click)="addOrRemoveLike()"></i></span>
      <span *ngIf="liked"><i title="dislike" style="color: black;padding-bottom: 15px;" class="fa fa-thumbs-up" (click)="addOrRemoveLike()"></i></span>
      <label for="comment" style="font-weight: bold">Comments:</label>
      <input type="text" [(ngModel)]="commentsText" class="form-control" id="comment">
      <span><button (click)="addComments(commentsText)" type="button" class="btn btn-primary">Add</button></span>
    </div>
    <div *ngFor="let text of comments;">
      <span class="col-md-7" style="float: left;font-weight: bold;
      font-size: 14px;padding-bottom: 15px;">{{text.comments}}</span>
      <span class="col-md-5" style="float: right;font-weight: bold;
      font-size: 14px;padding-bottom: 15px;">{{text.date | date: 'dd/MM/yyyy hh:mm:ss'}}</span> 
    </div>
  `
})
export class NgbdModalContent {
  @Input() imageSrc;
  liked: boolean = false;
  comments: any[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  addOrRemoveLike = function() {
    this.liked = !this.liked;
  }

  addComments = function(text) {
    var data = {
      comments: text,
      date: Date.now()
    }
    this.comments.push(data);
  }
}