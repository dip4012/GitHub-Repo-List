import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  public dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = [
    'navigate',
    'full_name',
    'description',
    'ownerName',
    'stargazers_count',
    'numberOfForks',
    'language',
  ];

  constructor(private http: HttpClient) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.http
      .get<any>(
        'https://api.github.com/search/repositories?q=language:Javascript&sort=stars&order=desc%20%27'
      )
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data.items.reverse());
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.dataSource.filterPredicate = function (
      data: any,
      filter: string
    ): boolean {
      return (
        !filter ||
        data.full_name.toLowerCase().includes(filter) ||
        data.language.toLowerCase().includes(filter)
      );
    };
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
