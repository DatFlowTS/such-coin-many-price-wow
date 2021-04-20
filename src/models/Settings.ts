import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('settings')
export class Settings {
	@PrimaryColumn({ type: 'varchar', length: 255 })
	guild!: string;

	@Column({ type: 'text', default: '{}' })
	settings: string;
}
