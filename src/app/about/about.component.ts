import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut, expand } from '../animation/app.animation';

import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block'
  },
  animations: [
    flyInOut(),
    expand() 
  ]
})
export class AboutComponent implements OnInit {

  leaders: Leader[];
  errMess: string;
  baseURL = baseURL;

  constructor(private leaderService: LeaderService) { }

  ngOnInit(): void {
    this.leaderService.getLeaders()
    .subscribe(leaders => this.leaders = leaders, errMess => this.errMess);
  }
}
