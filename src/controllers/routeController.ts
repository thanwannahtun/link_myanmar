import { Request, Response } from "express";
import sequelize from "../utils/db";
import { QueryTypes, Transaction } from "sequelize";

/// Define TypeScript interfaces

interface Agency {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface Seat {
  number: string;
  status: string;
}

interface Route {
  routeId: number;
  agency: Agency;
  origin: City;
  destination: City;
  midPoints: Midpoint[];
  seats: Seat[];
  scheduleDate: string;
  pricePerTrveller: number;
}

// xxx
interface Midpoint {
  cityId: number;
  cityName: string;
  cityOrder: number;
}

interface QueryResult<T> {
  data: T;
}

interface ApiResponse<T> {
  data?: T;
  error: any;
  message: string;
  status: number;
}

class RouteController {
  async getAllRoutes(req: Request, res: Response) {
    try {
      const query = `select json_arrayagg(
	json_object(
		"routeId",r.id,
        "agency",json_object(
			"id",a.id,
            "name",a.name
        ),
        "origin",json_object(
			"id",fromCity.id,
            "name",fromCity.name
        ),
        "destination",json_object(
			"id",toCity.id,
            "name",toCity.name
        ),
        "midpoints",(
			select json_arrayagg(
				json_object(
				'cityId', c.id,
                'cityName', c.name,
                'cityOrder', rc.city_order
                )
            ) from routecities rc 
            left join
				cities c on rc.route_id = r.id and rc.city_id = c.id
			where rc.city_id = c.id
        ),
        "seats",(
			select json_arrayagg(
				json_object(
					'number',s.seat_number,
                    'status',s.status
                )
            ) from seats s
            where r.id = s.route_id
        ),
        "scheduleDate",r.schedule_date,
        "pricePerTraveller",r.price_per_traveler
    )
) as data 
from routes r 
left join agencies a on r.agency_id = a.id
left join cities fromCity on r.origin_city_id = fromCity.id
left join cities toCity on r.destination_city_id = toCity.id
`;

      const [result, metadata] = await sequelize.query(query);

      const data = (result as QueryResult<Route[]>[])[0].data;

      const response: ApiResponse<Route[]> = {
        data: data,
        error: {},
        message: "success",
        status: 200,
      };
      // throw {"error":"hello"};

      res.status(200).send(response);
      console.log("************************");
      console.log(response);
      console.log("************************");
    } catch (error) {
      const response: ApiResponse<null> = {
        error: { error },
        message: "",
        status: 500,
      };

      res.status(500).send(response);
      console.log("error", error);
    }
  }

  async createRoute(req: Request, res: Response) {
    const {
      agency_id,
      origin_city_id,
      destination_city_id,
      schedule_date,
      price_per_traveler,
      seats_available,
    } = req.body;

    // perform input validation logic here !!!
    if (
      !agency_id ||
      !origin_city_id ||
      !destination_city_id ||
      !schedule_date ||
      !price_per_traveler ||
      !seats_available
    ) {
      return res.send({
        message: "error",
        status: 400,
        error: "Required fields are missing",
      });
    }

    try {
      const query = `
    INSERT INTO Routes 
        (agency_id, origin_city_id, destination_city_id, schedule_date, price_per_traveler,seats_available)
    VALUES 
        (?, ? , ? , ? , ? , ? )`;
      await sequelize.transaction(async (transaction) => {
        const [route_id] = await sequelize.query(query, {
          replacements: [
            agency_id,
            origin_city_id,
            destination_city_id,
            schedule_date,
            price_per_traveler,
            seats_available,
          ],
          type: QueryTypes.INSERT,
          transaction,
        });

        await this.addMidpointOrderUtil(
          route_id,
          origin_city_id,
          destination_city_id,
          transaction
        );

        const response: ApiResponse<Route> = {
          message: "success",
          status: res.statusCode,
          error: "",
        };
        console.log("results", route_id); // [18 , 1]

        res.send(response);
      });
    } catch (error) {
      console.log("error", error);

      const response: ApiResponse<null> = {
        message: "error",
        error: `Error : ${error}`,
        status: 500,
      };
      res.status(500).send(response);
    }
  }

  async addMidpointsToRoute(req: Request, res: Response) {
    const { route_id } = req.params;
    const { city_id, city_order } = req.body;

    // perform input validation logic here !!!
    if (!route_id || !city_id || !city_order) {
      return res.status(400).json({
        message: "Invalid input data",
        status: 400,
        error: "Required fields are missing",
      });
    }

    const transaction = await sequelize.transaction();

    try {
        await this.addMidpointOrderUtil(Number.parseInt(route_id),city_id,city_order,transaction);

      await transaction.commit();
    //   console.log("results", results); // [17 , 1] [18,1] , [19,2] , [20,1]

      const response: ApiResponse<null> = {
        message: "success",
        status: 201,
        error: "",
      };

      res.status(201).send(response);
    } catch (error) {
      await transaction.rollback();
      console.log("error", error);
      const response: ApiResponse<null> = {
        message: "error",
        status: 500,
        error: `Error : ${error}`,
      };
      res.status(500).send(response);
    }
  }

  async addSeatsToRoute(req: Request, res: Response) {
    const { route_id } = req.params;
    const { seats } = req.body;

    // Perform input validation
    if (!route_id || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        message: "Invalid input data",
        status: 400,
        error: "Required fields are missing or incorrect",
      });
    }

    const placeholders = seats.map(() => "(?, ?, 'Available')").join(", ");
    const replacements: any[] = [];

    seats.forEach((seat: string) => {
      replacements.push(route_id, seat);
    });

    const insertQuery = `
        INSERT INTO Seats (route_id, seat_number, status)
        VALUES ${placeholders}
    `;

    const transaction = await sequelize.transaction();

    try {
      const results = await sequelize.query(insertQuery, {
        replacements,
        type: QueryTypes.INSERT,
        transaction,
      });
      console.log("result", results); // result [ 268, 40 ]
      // Commit the transaction
      await transaction.commit();

      const response: ApiResponse<null> = {
        message: "success",
        status: 201,
        error: null,
      };

      res.status(201).send(response);
    } catch (error) {
      // Rollback the transaction
      await transaction.rollback();

      console.log("error", error);

      const response: ApiResponse<null> = {
        message: "error",
        status: 500,
        error: `Error: ${error}`,
      };

      res.status(500).send(response);
    }
  }

  /// [Utils]
  private async addMidpointOrderUtil(
    route_id: number,
    city_id: number,
    city_order: number,
    transaction?: Transaction
  ) {
    const query = `
        INSERT INTO RouteCities
            (route_id , city_id , city_order)
        VALUES
            (?,?,?)
    `;

    await sequelize.query(query, {
      replacements: [route_id, city_id, city_order],
      type: QueryTypes.INSERT,
      transaction,
    });
  }
}

export const routeController = new RouteController();
