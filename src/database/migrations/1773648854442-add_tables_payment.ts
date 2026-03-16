import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablesPayment1773648854442 implements MigrationInterface {
    name = 'AddTablesPayment1773648854442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_backup" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reff" character varying(100) NOT NULL, "x" bigint NOT NULL, "name" character varying(255) NOT NULL, "code" character varying(50) NOT NULL, "status" character varying(20) NOT NULL, "paid_at" TIMESTAMP WITH TIME ZONE, "backed_up_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_64793d326b0e0e0606a47b833bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2efb5696c379eb017a3f8198dc" ON "transaction_backup" ("reff") `);
        await queryRunner.query(`CREATE TABLE "payment_order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reff" character varying(100) NOT NULL, "amount" bigint NOT NULL, "name" character varying(255) NOT NULL, "hp" character varying(50) NOT NULL, "code" character varying(50) NOT NULL, "expired" character varying(50) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'pending', "paid_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f5221735ace059250daac9d9803" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7db79f7842b577e325715dd1e2" ON "payment_order" ("reff") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7db79f7842b577e325715dd1e2"`);
        await queryRunner.query(`DROP TABLE "payment_order"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2efb5696c379eb017a3f8198dc"`);
        await queryRunner.query(`DROP TABLE "transaction_backup"`);
    }

}
