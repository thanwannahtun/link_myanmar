import { Request, Response } from "express";
import sequelize from "../utils/db";
import { QueryTypes } from "sequelize";
import { Agency, ApiResponse } from "../utils/api/util";

class AgencyController {
  async registerAgency(req: Request, res: Response) {
    const { userId, name, description, contactInfo, logo, address } = req.body;

    if (!userId || !name || !contactInfo || !address) {
      return res.status(400).send({
        error: "Required field missing!",
        message: "User fault!",
        status: 400,
      });
    }

    const query = `INSERT INTO Agencies (user_id,name,description,logo,contact_info,address)
                   VALUES 
                   (?,?,?,?,?,?)`;
    try {
      await sequelize.transaction(async (transaction) => {
        const [agencyId] = await sequelize.query(query, {
          replacements: [userId, name, description, logo, contactInfo, address],
          transaction,
          type: QueryTypes.INSERT,
        });

        const agency: Agency = {
          id: agencyId,
          name: name,
          userId: userId,
          contactInfo: contactInfo,
          address: address,
          description: description,
          logo: logo,
        };

        const response : ApiResponse<Agency> = {
            data:agency,
            error:'',
            message:"success",
            status:201
        }
        res.status(201).send(response);
      });
    } catch (error) {
         const response : ApiResponse<null> = {
            error:'Server Error!',
            message:"error",
            status:500
        }
        res.status(500).send(response);
    }
  }

}

export const agencyController = new AgencyController();