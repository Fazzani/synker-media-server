export class Page {
  constructor(public title: string, public breadcrumb: string[], public currentPage: string) {}
}

export class BreadCrumb {
  constructor(public title: string, public link: string, public pageName: string) {}
}
