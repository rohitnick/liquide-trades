import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTradeTable1734717987295 implements MigrationInterface {
    name = 'CreateTradeTable1734717987295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."trade_type_enum" AS ENUM('buy', 'sell')
        `);
        await queryRunner.query(`
            CREATE TABLE "trade" (
                "id" SERIAL NOT NULL,
                "type" "public"."trade_type_enum" NOT NULL,
                "user_id" integer NOT NULL,
                "symbol" character varying NOT NULL,
                "shares" integer NOT NULL,
                "price" double precision NOT NULL,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b677c5a2b25cb3b0ba8608165b" ON "trade" ("type")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ac40608b8665839bcbb69ab510" ON "trade" ("user_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ac40608b8665839bcbb69ab510"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_b677c5a2b25cb3b0ba8608165b"
        `);
        await queryRunner.query(`
            DROP TABLE "trade"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."trade_type_enum"
        `);
    }

}
