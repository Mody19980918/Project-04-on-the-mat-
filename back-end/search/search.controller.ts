import express from "express";
import { SearchService } from "./search.service";

export class SearchController {
  constructor(private searchService: SearchService) {}
  getClassInformation = async (req: express.Request, res: express.Response) => {
    try {
      let { data } = req.params;
      let result = await this.searchService.getClassInformation(data);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getTeacherInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { data } = req.params;
      let result = await this.searchService.getTeacherInformation(data);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  getStudioInformation = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { data } = req.params;
      let result = await this.searchService.getStudioInformation(data);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
}
